using UnityEngine;
using Firebase;
using Firebase.Database;
using Firebase.Extensions;
using UnityEngine.SceneManagement;
using System;
using System.Collections.Generic;

using System.Collections;


public class ManageDbConnection : MonoBehaviour
{
    [Header("Firebase")]
    public DependencyStatus dependencyStatus;
    public DatabaseReference DBreference;

    private Coroutine stressCoroutine = null;
    private string currentSessionId = "";
    private Coroutine neutralCoroutine = null;
    private Coroutine autoModeCoroutine;
    private string lastStressState = "";
    private string currentMode = "";




    [System.Serializable]
    public class SessionData
    {
        public string session_id;
        public string scene;
        public bool start_session = true;
    }

    private int current_level = -99;

    private readonly Dictionary<int, float> levelEndTimes = new Dictionary<int, float>
{
    {1, 20.0f},
    {2, 36f},
    {3, 65f},
    {4, 99f},
    {5, 120.0f}
};


    // public GameObject LevelScipt;

    public ControlAnimation ControlAnimationReference;



    void Awake()
    {
        FirebaseApp.CheckAndFixDependenciesAsync().ContinueWith(task =>
        {
            dependencyStatus = task.Result;
            if (dependencyStatus == DependencyStatus.Available)
            {
                InitializeFirebase();
                // LevelScipt.SetActive(true);
            }
            else
            {
                Debug.LogError("Could not resolve all Firebase dependencies: " + dependencyStatus);
                // LevelScipt.SetActive(false);
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
            string scene = data.scene == "Glossophobia" ? "GlossophobiaLevel1" :"HomeScene";

            if (data.start_session)
            {
                if (scene != SceneManager.GetActiveScene().name)
                {
                    switch (data.scene)
                    {
                        case "Glossophobia":
                            GoToScene("GlossophobiaLevel1");
                            break;
                        case "Acrophobia":
                            // GoToScene("Acrophobia");
                            break;
                    }
                }

                currentSessionId = data.session_id.Trim();
                ListenToSessionDetails(currentSessionId);
            }
            else
            {
                // ResetSessionData();
                GoToScene("HomeScene");
            }
        }
    }


    private void ListenToSessionDetails(string session_id)
    {
        DBreference.Child("/sessions/" + session_id).ValueChanged += (object sender, ValueChangedEventArgs args) =>
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

            ProcessLevel(levelStr, session_id, mode);

            if (stressState != lastStressState)
            {
                Debug.Log("Change in stress state, skipping...");
                if (stressCoroutine != null)
                {
                    StopCoroutine(stressCoroutine);
                    stressCoroutine = null;
                }

                if (neutralCoroutine != null)
                {
                    StopCoroutine(neutralCoroutine);
                    neutralCoroutine = null;
                }
                // return;
            }
            lastStressState = stressState;

            // if (mode == "auto" && stressState == "neutral" && neutralCoroutine == null)
            // {
            //     if (this != null && this.gameObject != null)
            //     {
            //         neutralCoroutine = StartCoroutine(HandleNeutralStress(session_id, levelStr));
            //     }
            // }

            if (mode == "manual")
            {
                Debug.Log("Mode: manual — standard level flow.");
                // ProcessLevel(levelStr, session_id, mode);
            }
            else if (mode == "auto")
            {
                Debug.Log($"Mode: auto — stress state: {stressState}");

                // if (stressCoroutine != null) { StopCoroutine(stressCoroutine); stressCoroutine = null; }
                // if (neutralCoroutine != null) { StopCoroutine(neutralCoroutine); neutralCoroutine = null; }
                // if (stressCoroutine == null && this != null && this.gameObject != null)
                // {
                //     Debug.Log("Starting high stress coroutine...");
                //     stressCoroutine = StartCoroutine(HandleHighStress(session_id, levelStr));
                // }

                // if (neutralCoroutine == null && this != null && this.gameObject != null)
                // {
                //     Debug.Log("Starting neutral coroutine...");
                //     neutralCoroutine = StartCoroutine(HandleNeutralStress(session_id, levelStr));
                // }

                switch (stressState)
                {
                    case "very high":
                        Debug.Log("Stress state is VERY HIGH. Sending to HomeScene.");
                        ResetSessionData();
                        break;

                    case "high":
                        // if (this == null || this.gameObject == null)
                        // {
                        //     Debug.LogWarning("ManageDbConnection object destroyed. Skipping coroutine start.");
                        //     return;
                        // }
                        // // stressCoroutine = StartCoroutine(HandleHighStress(session_id, levelStr));
                        // break;
                

                        if (neutralCoroutine != null)
                        {
                            StopCoroutine(neutralCoroutine);
                            neutralCoroutine = null;
                        }

                        if (stressCoroutine == null )
                        {
                            Debug.Log("Starting high stress coroutine...");
                            stressCoroutine = StartCoroutine(HandleHighStress(session_id, levelStr));
                        }
                
                        break;


                    case "neutral":
                        // if (neutralCoroutine == null && this != null && this.gameObject != null)
                        // {
                        //     // StopCoroutine(neutralCoroutine);
                        //     Debug.Log("Starting neutral coroutine...");
                        //     neutralCoroutine = StartCoroutine(HandleNeutralStress(session_id, levelStr));
                        // }
                        // if (this == null || this.gameObject == null)
                        // {
                        //     Debug.LogWarning("ManageDbConnection object destroyed. Skipping coroutine start.");
                        //     return;
                        // }

                        // break;
                        
                        if (stressCoroutine != null)
                        {
                            StopCoroutine(stressCoroutine);
                            stressCoroutine = null;
                        }

                        if (neutralCoroutine == null )
                        {
                            Debug.Log("Starting neutral stress coroutine...");
                            neutralCoroutine = StartCoroutine(HandleNeutralStress(session_id, levelStr));
                        }
                        break;
                }
            }
        };
    }

    private IEnumerator HandleHighStress(string session_id, string levelStr)
    {
        Debug.Log("Stress state is HIGH. Waiting 15 seconds to reevaluate...");
        yield return new WaitForSeconds(15);

        var task = DBreference.Child($"/sessions/{session_id}/stress_state").GetValueAsync();
        yield return new WaitUntil(() => task.IsCompleted);

    
            if (task.IsCompletedSuccessfully && task.Result.Exists)
            {
                string updatedState = task.Result.Value?.ToString()?.ToLower();
                if (updatedState == "high")
                {
                    int level;
                if (int.TryParse(levelStr, out level))
                {
                    level = Mathf.Max(0, level - 1);
                    if (ControlAnimationReference != null)
                    {
                        current_level = level;
                        ControlAnimationReference.level = level;

                        DBreference.Child($"/sessions/{session_id}/current_level")
                        .SetValueAsync(level)
                        .ContinueWithOnMainThread(task =>
                        {
                            if (task.IsCompletedSuccessfully)
                            {
                                Debug.Log("Updated current_level in DB to: " + level);
                            }
                            else
                            {
                                Debug.LogError("Failed to update current_level: " + task.Exception);
                            }
                        });
                        Debug.Log($"Stress still HIGH → Level decreased to {level}");
                    }
                        SendUpdatesToDB(session_id, level, currentMode);
                    }
                }
                else
                {
                    Debug.Log($"Stress no longer high after 15s — current: {updatedState}");
                }
            }
        

        stressCoroutine = null;
    }


    private IEnumerator HandleNeutralStress(string session_id, string levelStr)
    {
        Debug.Log("Stress state is NEUTRAL. Waiting 10 seconds before leveling up...");

        int level = -1;
        if (int.TryParse(levelStr, out level))
        {
            if (level == 0)
            {
                Debug.Log("Neutral detected at Level 0 – waiting 10 seconds before leveling up.");
                yield return new WaitForSeconds(10f);
            }
            else if (levelEndTimes.ContainsKey(level))
            {
                float targetTime = levelEndTimes[level];
                Debug.Log($"Neutral stress: Waiting for timeline to reach end of Level {level} ({targetTime} sec).");

                if (level == 5)
                {
                    Debug.Log("Level 5: waiting 20s before returning to HomeScene...");
                    while (ControlAnimationReference.director.time < targetTime)
                    {
                        yield return null;
                    }
                    Debug.Log("Level 5: ended...");
                    // yield return new WaitForSeconds(10f);
                    ResetSessionData();
                    GoToScene("HomeScene");
                    yield break;
                }
                else
                {
                    while (ControlAnimationReference.director.time < targetTime)
                    {
                        yield return null;
                    }

                    ControlAnimationReference.director.Pause();
                }
            }
            else
            {
                Debug.LogWarning($"No end time defined for Level {level}. Skipping level-up wait.");
            }

        }

        // Confirm stress state still neutral
        var task = DBreference.Child($"/sessions/{session_id}/stress_state").GetValueAsync();
        yield return new WaitUntil(() => task.IsCompleted);

        if (task.IsCompletedSuccessfully && task.Result.Exists)
        {
            string updatedState = task.Result.Value?.ToString()?.ToLower();
            if (updatedState == "neutral" && lastStressState !="high")
            {
                    int nextLevel = level + 1;
                    if (nextLevel <= 5)
                    {
                        Debug.Log($"Leveling up from {level} to {nextLevel} due to neutral stress.");
                        current_level = nextLevel;
                        ControlAnimationReference.level = nextLevel;

                        // Update current_level in Firebase
                        DBreference.Child($"/sessions/{session_id}/current_level").SetValueAsync(nextLevel);
                        SendUpdatesToDB(session_id, nextLevel, currentMode);
                    }
                    else
                    {
                        Debug.Log("Already at max level. No further level-up.");
                    }

          
            }
            else
            {
                Debug.Log($"Stress state changed before 10s completed. Now: {updatedState}. No level-up.");
            }
        }

        neutralCoroutine = null;
    }



    private void ProcessLevel(string LevelStr, string session_id, string mode)
    {
        int level;
        if (int.TryParse(LevelStr, out level))
        {
            if (ControlAnimationReference != null)
            {
                if (current_level != level)
                {
                    current_level = level;
                    ControlAnimationReference.level = level;
                    SendUpdatesToDB(session_id, level, currentMode);
                }
            }
            // else
            // {
            //     Debug.LogWarning("Control Animation reference not set!");
            // }
        }
    }




    private void SendUpdatesToDB(string session_id, int level, string mode)
    {

        long timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();


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


    public void GoToScene(string scene)
    {
        SceneManager.LoadScene(scene);
    }


    private void setOnDisconnect()
    {
        DBreference.Child("/pre_session_validation/equipment_ready/headset_ready").OnDisconnect().SetValue(false);
    }
    private void ResetSessionData()
    {
    
        DBreference.Child("/pre_session_validation/session/start_session").SetValueAsync(false);


        Debug.Log("Session data reset: scene=Home, start_session=false, session_id=none");
    }
}


