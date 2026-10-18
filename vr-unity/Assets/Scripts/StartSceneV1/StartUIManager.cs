using UnityEngine;
using Firebase;
using Firebase.Auth;
using UnityEngine.UI;
using TMPro;


public class StartUIManager : MonoBehaviour
{

    public static StartUIManager instance;
    public GameObject loginUI; 
    public GameObject mainUI;

    public Button GoToLoginButton;
    public Button LogoutButton;
    public TMP_Text ConnectionStatus;

    [Header("Firebase")]
    public DependencyStatus dependencyStatus;
    public FirebaseAuth auth;    



    void Start(){
         loginUI.SetActive(false);
        mainUI.SetActive(true);
        Debug.Log("start");

        // Initialize Firebase
        FirebaseApp.CheckAndFixDependenciesAsync().ContinueWith(task =>
        {
            var dependencyStatus = task.Result;
            if (dependencyStatus == DependencyStatus.Available)
            {
                auth = FirebaseAuth.DefaultInstance;

                // Check if user is signed in
                if (auth.CurrentUser != null)
                {
                    Debug.Log("User is logged in: " + auth.CurrentUser.Email);
                    
                }
                else
                {
                    Debug.Log("No user is currently logged in.");
                    
                }
            }
            else
            {
                Debug.LogError("Could not resolve all Firebase dependencies: " + dependencyStatus);
            }
        });    
        
       
    }

    void Update()
    {
        if (auth.CurrentUser != null)
            {
                Debug.Log("User is logged in: " + auth.CurrentUser.Email);
                GoToLoginButton.gameObject.SetActive(false); 
                LogoutButton.gameObject.SetActive(true); 
                ConnectionStatus.text = "Welcome, " + auth.CurrentUser.Email;
                MainInterface();
            }
        else
            {
                Debug.Log("No user is currently logged in.");
                GoToLoginButton.gameObject.SetActive(true);
                LogoutButton.gameObject.SetActive(false);
                ConnectionStatus.text = "Please log in to continue";
            }
        
    }




    private void Awake()
    {
        if (instance == null){
            instance = this;
        }

        else if (instance != null){
            Debug.Log("Instance already exists, destroying object!");
            Destroy(this);
        }

        
    }



    public void LoginInterface() 
    {
        loginUI.SetActive(true);
        mainUI.SetActive(false);
    }

    public void MainInterface() 
    {
        loginUI.SetActive(false);
        mainUI.SetActive(true);
    }
}

