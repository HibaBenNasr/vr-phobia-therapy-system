using UnityEngine;
using Firebase;
using Firebase.Database;
using Firebase.Extensions;
using UnityEngine.SceneManagement;
using System;


public class ManageDB : MonoBehaviour
{

    [Header("Firebase")]
    public DependencyStatus dependencyStatus;
    public DatabaseReference DBreference;

    private string currentSessionId = "";
    private string currentMode = "";
    private int current_level = -99;

    [System.Serializable]
    public class SessionData
    {
        public string session_id;
        public string scene;
        public bool start_session = true;
    }

    public ManageLevels manageLevels;
    private EventHandler<ValueChangedEventArgs> currentSessionListener;


    void Awake()
    {
        FirebaseApp.CheckAndFixDependenciesAsync().ContinueWith(task =>
        {
            dependencyStatus = task.Result;
            if (dependencyStatus == DependencyStatus.Available)
            {
                InitializeFirebase();
            }
            else
            {
                Debug.LogError("Could not resolve all Firebase dependencies: " + dependencyStatus);
            }
        });
    }

    private void InitializeFirebase()
    {
        Debug.Log("Firebase initialized.");

        // Assure-toi que c'est bien l'URL de ta base Firebase !
        FirebaseApp.DefaultInstance.Options.DatabaseUrl = new System.Uri("https://phobia-management-2ef56-default-rtdb.asia-southeast1.firebasedatabase.app/");

        DBreference = FirebaseDatabase.DefaultInstance.RootReference;

        setOnDisconnect();
        StartListeningToSession();

    }

    private void StartListeningToSession()
    {
        DBreference.Child("/pre_session_validation/session").ValueChanged += OnSessionChanged;
    }

    private void OnSessionChanged(object sender, ValueChangedEventArgs args)
    {
        if (args.DatabaseError != null)
        {
            Debug.LogError("Session DB Error: " + args.DatabaseError.Message);
            return;
        }

        if (args.Snapshot.Exists)
        {
            string json = args.Snapshot.GetRawJsonValue();
            SessionData data = JsonUtility.FromJson<SessionData>(json);
            string scene = data.scene == "Acrophobia" ? "SkyscraperScenario" :"HomeScene";

            if (data.start_session)
            {
                currentSessionId = data.session_id.Trim();
                ListenToSessionDetails(currentSessionId);
            }
            else
            {
                // ResetSessionData();
                SceneManager.LoadScene("HomeScene");
            }
        }
    }

    private void ListenToSessionDetails(string session_id)
    {
        if (currentSessionListener != null)
        {
            DBreference.Child("/sessions/" + session_id).ValueChanged -= currentSessionListener;
        }
        currentSessionListener = (object sender, ValueChangedEventArgs args) =>
        {
            if (args.DatabaseError != null)
            {
                Debug.LogError("Session detail DB error: " + args.DatabaseError.Message);
                return;
            }

            if (!args.Snapshot.Exists) return;

            string mode = args.Snapshot.Child("mode").Value?.ToString();
            string levelStr = args.Snapshot.Child("current_level").Value?.ToString();
            string stressState = args.Snapshot.Child("stress_state").Value?.ToString()?.ToLower();

            currentMode = mode;

            int level;
            if (!int.TryParse(levelStr, out level))
            {
                Debug.LogWarning("Failed to parse level from database: " + levelStr);
                return; // or set a default / handle differently
            }

            
            manageLevels.mode = mode;
            current_level = level;
            manageLevels.stress_state = stressState;
            if (mode == "manual")
            {
                Debug.Log($"DB level: {level}, local current_level: {current_level}");
           
            }
        };
        DBreference.Child("/sessions/" + session_id).ValueChanged += currentSessionListener;
    }




    public void SendUpdatesToDB(int level)
    {
        string session_id = currentSessionId;
        string mode = currentMode;
        long timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        DBreference.Child($"/sessions/{session_id}/current_level").SetValueAsync(level);

        string json = $"{{" +
                        $"\"level\": \"{level}\"," +
                        $"\"mode\": \"{mode}\"" +
                        $"}}";

        string path = $"/sessions/{session_id}/level_transitions/{timestamp}";


        DBreference.Child(path).SetRawJsonValueAsync(json).ContinueWithOnMainThread(task =>
        {
            if (task.IsFaulted)
            {
                Debug.LogError("Error loading data: " + task.Exception);
            }

            else if (task.IsCompletedSuccessfully)
            {
                Debug.Log("level added to DB");
            }
            else
            {
                Debug.Log("No data found for this user.");
            }
        });

        DBreference.Child($"/sessions/{session_id}/").Child("last_updated").SetValueAsync(timestamp).ContinueWithOnMainThread(task =>
        {
            if (task.IsCompleted)
            {
                Debug.Log("Data set successfully in Firebase.");
            }
            else
            {
                Debug.LogError("Error setting data in Firebase: " + task.Exception);
            }
        });
        
    }

    public int getLevel()
    {
        return current_level;
    }

    private void setOnDisconnect()
    {
        DBreference.Child("/pre_session_validation/equipment_ready/headset_ready").OnDisconnect().SetValue(false);
    }
    public void ResetSessionData()
    {
        DBreference.Child("/pre_session_validation/session/start_session").SetValueAsync(false);
        SceneManager.LoadScene("HomeScene");
    }
}
