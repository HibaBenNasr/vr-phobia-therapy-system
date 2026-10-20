#include <Wire.h>
#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "MAX30105.h"
#include "heartRate.h"
#include <time.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"


// —— Wi-Fi Credentials —————————————————————————————————————
#define WIFI_SSID       "wifi_ssid"
#define WIFI_PASSWORD   "wifi_password"

// —— Firebase Credentials ——————————————————————————————————
#define API_KEY         "YOUR_API_KEY"
#define USER_EMAIL      "YOUR_USER_EMAIL"
#define USER_PASSWORD   "YOUR_USER_PASSWORD"
#define DATABASE_URL    "YOUR_DATABASE_URL"




// —— NTP Settings ———————————————————————————————————————
const char* ntpServer = "pool.ntp.org";


// —— Firebase Setup —————————————————————————————————————
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;


// —— MAX30102 Setup ————————————————————————————————————
MAX30105 particleSensor;
const byte RATE_SIZE = 4;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;
float beatsPerMinute;
int beatAvg = 0;


// —— PARAMETERS —————————————————————————————————————————
volatile bool sessionActive = false;
unsigned long lastTs = 0, lastSession = 0, lastData=0;
volatile int globalBPM = 0;  
volatile bool contactDetected = false; 
String sessionId = "none";
const char* stressLvlTable[] = { "neutral", "high", "very high" };
uint8_t lastIndex = 0; 





unsigned long getTimestamp() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo))return(0);
  time(&now);
  return now;
}


void sensorTask(void * parameter) {
  while(true){
    long irValue = particleSensor.getIR();  // Lecture de la valeur infrarouge

    if (checkForBeat(irValue) == true) {    // Si un battement est détecté
      long delta = millis() - lastBeat;     // Temps depuis le dernier battement
      lastBeat = millis();
      beatsPerMinute = 60 / (delta / 1000.0);  // Calcul du BPM actuel

      if (beatsPerMinute < 255 && beatsPerMinute > 40) {  // Filtrage des valeurs incohérentes
        rates[rateSpot++] = (byte)beatsPerMinute;         // Stockage du BPM
        rateSpot %= RATE_SIZE;                            // Gestion de l'index circulaire

        // Calcul de la moyenne des BPM
        beatAvg = 0;
        for (byte x = 0; x < RATE_SIZE; x++)
          beatAvg += rates[x];
        beatAvg /= RATE_SIZE;
      }
    }
  
    Serial.print("IR=");
    Serial.print(irValue);
    Serial.print(", BPM=");
    Serial.print(beatsPerMinute);
    Serial.print(", Avg BPM=");
    Serial.print(beatAvg);


    if (irValue < 50000)     {
      Serial.print(" No contact?");
      beatAvg = 0;
      contactDetected = false;
    } else contactDetected = true;
      
    Serial.println();
    globalBPM = beatAvg;

    vTaskDelay(10 / portTICK_PERIOD_MS);  // 10 ms = 100 Hz
  }
}


void firebaseTask(void * parameter) {
  while(true){
    unsigned long now = millis();

    // send timestamp every 5 seconds to database
    if(now - lastTs >= 5000){
      lastTs = now;
      unsigned long ts = getTimestamp();
      Serial.printf("ts→ %lu\n", ts);
      if(Firebase.RTDB.setInt(&fbdo, "/pre_session_validation/equipment_ready/sensors_ready/last_online", ts)){}
        Serial.println("Timestamp set");
    }

    // check if a session started 
    if(now - lastSession >= 2000){
      lastSession = now;
      if(Firebase.RTDB.getBool(&fbdo, "/pre_session_validation/session/start_session")){
        sessionActive = fbdo.boolData();
        Serial.printf("sessionActive=%d\n", sessionActive);
      } 
    }

    
    // if session started, start sending sensor data every 5 seconds
    if (now - lastData >=1000){
      if (sessionActive){
        // get the session id
        if(Firebase.RTDB.getString(&fbdo, "/pre_session_validation/session/session_id")){
          sessionId = fbdo.stringData();
          Serial.printf("sessionActive=%d\n", sessionActive);
        } 

        lastData = now;
        if (sessionId != "none"){ // check if session id is set 
          long bpm = globalBPM;
          if(bpm>45 && bpm<180){  // filter sensor data
            uint8_t index = (bpm <= 120) ? 0 : (bpm <= 140) ? 1 : 2;
            if (index != lastIndex) {
              lastIndex = index;
              Firebase.RTDB.setString(&fbdo, "sessions/"+sessionId+"/stress_state", String(stressLvlTable[index]));  //set stress state
            }
            FirebaseJson json;
            json.set("BPM", bpm);
            json.set("stress_level", String(stressLvlTable[index]));

            if (Firebase.RTDB.setJSON(&fbdo,  "sessions/"+sessionId+"/sensorData/" + String(getTimestamp()), &json)) {  // add data to datbase
              Serial.println("HR sent");
            } 
          }
          if (!contactDetected){
            // if the sensor badly placed send msg to database
            if (Firebase.RTDB.setString(&fbdo, "sessions/"+sessionId+"/notes/" + String(getTimestamp()), "No contact detected")) { 
              Serial.println("msg sent");
            } 
          }
        }  
      }
    }  

    vTaskDelay(500 / portTICK_PERIOD_MS);
  }
}
// —— Arduino Setup/Loop —————————————————————————————————
void setup() {
  Serial.begin(115200);

  // Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.println("\nWi-Fi connected");

  //Time Server
  configTime(0, 0, ntpServer);

   // Firebase setup
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  while (!Firebase.ready()) delay(100);
  

  // Sensor init
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 was not found. Please check wiring/power."); 
    while (1) ;
  }
  Serial.println("Place your index finger on the sensor with steady pressure.");
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);

  xTaskCreatePinnedToCore(
    sensorTask,        // Function to call
    "Sensor Task",     // Name of task
    2048,             // Stack size
    NULL,              // Parameters
    1,                 // Priority
    NULL,              // Task handle
    1                  // Core 1
  );

  xTaskCreatePinnedToCore(
    firebaseTask,        // Function to call
    "Firebase Task",     // Name of task
    8192,             // Stack size
    NULL,              // Parameters
    1,                 // Priority
    NULL,              // Task handle
    0                  // Core 0
  );
}



void loop(){
}
