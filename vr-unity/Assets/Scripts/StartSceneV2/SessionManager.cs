using UnityEngine;
using Firebase;
using Firebase.Database;
using Firebase.Extensions;
using UnityEngine.SceneManagement;


public class SessionManager : MonoBehaviour
{
    [Header("Firebase")]
    public DependencyStatus dependencyStatus;
    public DatabaseReference DBreference;


    [System.Serializable]
    public class SessionData
    {
        public string session_id;
        public string scene;
        public bool start_session=false;
    }

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

        FirebaseApp.DefaultInstance.Options.DatabaseUrl = new System.Uri("https://phobia-management-2ef56-default-rtdb.asia-southeast1.firebasedatabase.app/");

        DBreference = FirebaseDatabase.DefaultInstance.RootReference;

        setOnDisconnect();

        setOnConnect();
        
    }


    void Update()
    {
        if(DBreference!=null){
            LoadData();
        }
        checkWsConnection();
    }

    public void LoadData()
    {
        
        DBreference.Child("/pre_session_validation/session").GetValueAsync().ContinueWithOnMainThread(task =>
        {
            if (task.IsFaulted)
            {
                Debug.LogError("Error loading data: " + task.Exception);
            }

            else if (task.IsCompleted && task.Result.Exists)
            {
                string json = task.Result.GetRawJsonValue();
                SessionData data = JsonUtility.FromJson<SessionData>(json);
                if (data.start_session)
                {
                    if (data.scene == "Glossophobia")
                    {
                        GoToScene("GlossophobiaLevel1");
                    }
                    else if (data.scene == "Acrophobia")
                    {
                        GoToScene("SkyscraperScenario");
                    } 
                    else if (data.scene=="Home"){
                        GoToScene("HomeScene");
                    } 
                }        
            }
            else
                {
                    Debug.Log("No data found for this user.");
                }
        });

    }


    private void setOnDisconnect(){
        DBreference.Child("/pre_session_validation/equipment_ready/headset_ready").OnDisconnect().SetValue(false);
    }

    private void setOnConnect(){
        DBreference.Child("pre_session_validation/equipment_ready/headset_ready").SetValueAsync(true).ContinueWithOnMainThread(task =>
        {
            if (task.IsFaulted)
            {
                Debug.LogError("Error loading data: " + task.Exception);
            }

            else if (task.IsCompleted)
            {
                Debug.Log("headset_ready On");
            }
            else
                {
                    Debug.Log("No data found for this user.");
                }
        });
    }
    
    void checkWsConnection(){
        // Debug.Log("check if esp32 conncted");
        // if esp32 conneced > set equipement_ready true
    }
    public void GoToScene(string scene){
        SceneManager.LoadScene(scene);
    }

    // public void GoToScene2(){
    //     SceneManager.LoadScene("HomeScene");
    // }



}
