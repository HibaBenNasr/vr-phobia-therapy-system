using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

public class ManageLevels : MonoBehaviour
{
    public static ManageLevels Instance { get; private set; }

    public int currentLevel;
    public string mode = "manual";
    public string stress_state;

    public bool level0Ended, level1Ended, level2Ended, level3Ended, level4Ended, level5Ended;

    private bool autoRunning;

    private Coroutine autoModeCoroutine;

    public ManageDB manageDB;

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject); // Destroy duplicates
            return;
        }

        Instance = this;
        DontDestroyOnLoad(gameObject); // Optional: Persist across scenes
    }

    void Start()
    {
        autoModeCoroutine = StartCoroutine(ModeWatcher());
    }

    IEnumerator ModeWatcher()
    {
        while (true)
        {
            currentLevel = manageDB.getLevel();
            if (mode == "auto")
            {
                yield return StartCoroutine(AutoModeLoop());
            }
            else // manual mode, just wait
            {
                yield return null;
            }
        }
    }


    public void SetLevel(int newLevel)
    {
        currentLevel = newLevel;
    }


    private IEnumerator AutoModeLoop()
    {
        while (mode == "auto")
        {
            currentLevel = manageDB.getLevel();        
            if (stress_state == "very high")
            {
                SceneManager.LoadScene("HomeScene");
                yield break;
            }
            else if (stress_state == "high")
            {
                Debug.Log("High waiting 10 seconds");
                yield return new WaitForSeconds(10);
                Debug.Log("after waiting 10 seconds");
                if (stress_state == "high" && currentLevel > 0)
                {
                    // currentLevel--;
                    manageDB.SendUpdatesToDB(currentLevel - 1);
                }
            }
            else if (stress_state == "neutral")
            {
                Debug.Log("in neutral state, with level : " + currentLevel);
                switch (currentLevel)
                {
                    case 0:
                        level0Ended = false;
                        yield return new WaitForSeconds(10);
                        Debug.Log("waiting 10 seconds");
                        if (mode != "auto" || stress_state != "neutral")  break;
                        level0Ended = true;
                        // currentLevel++;
                        manageDB.SendUpdatesToDB(currentLevel + 1);
                        Debug.Log("updates sent to database, level : " + currentLevel + 1);
                        break;
                    case 1:
                        level1Ended = false;
                        yield return new WaitForSeconds(10);
                        if (mode != "auto" || stress_state != "neutral")  break;
                        Debug.Log("waiting 10 seconds");
                        level1Ended = true;
                        // currentLevel++;
                        manageDB.SendUpdatesToDB(currentLevel + 1);
                        break;
                    case 2:
                        level2Ended = false;
                        yield return new WaitForSeconds(15);
                        if (mode != "auto" || stress_state != "neutral") break;
                        level2Ended = true;
                        // currentLevel++;
                        manageDB.SendUpdatesToDB(currentLevel + 1);
                        break;
                    case 3:
                        level3Ended = false;
                        yield return new WaitForSeconds(15);
                        if (mode != "auto" || stress_state != "neutral")  break;
                        level3Ended = true;
                        // currentLevel++;
                        manageDB.SendUpdatesToDB(currentLevel + 1);
                        break;
                    case 4:
                    if (mode != "auto" || stress_state != "neutral") break;
                        yield return new WaitUntil(() => level4Ended);
                        // currentLevel++;
                        if (mode != "auto" || stress_state != "neutral") break;
                        yield return new WaitForSeconds(5);
                        manageDB.SendUpdatesToDB(currentLevel + 1);
                        
                        break;
                    case 5:
                        level5Ended = false;
                        yield return new WaitUntil(() => level5Ended);
                        if (mode != "auto" || stress_state != "neutral")  break;
                        // manageDB.SendUpdatesToDB(currentLevel);
                        Debug.Log("End waiting 10 seconds");
                        yield return new WaitForSeconds(10);
                        Debug.Log("After End waiting 10 seconds");
                        manageDB.ResetSessionData();
                         
                        // SceneManager.LoadScene("HomeScene");
                        yield return null;
                        break;
                }
            }
            yield return null;
        }
    }

    
}
