using UnityEngine;
using Firebase;
using Firebase.Auth;
using UnityEngine.UI;
using TMPro;
using System.Threading.Tasks;
using System.Collections;


public class ConnectionStatus : MonoBehaviour
{
    public static ConnectionStatus instance;

    // public TMP_Text ConnectionStatusText;
    public GameObject RTScript;
    public GameObject ConnectedText;
    public GameObject DisconnectedText;

    [Header("Firebase")]
    public DependencyStatus dependencyStatus;
    public FirebaseAuth auth;
    public FirebaseUser User;

    



    void Start()
    {
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
                    Debug.Log("Headset Connected");    
                }
                else
                {
                    Debug.Log("Trying to connect...");
                    StartCoroutine(Login());
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
                // Debug.Log("User is logged in: " + auth.CurrentUser.Email);
                // ConnectionStatusText.text = "Headset Connected";
                RTScript.SetActive(true);
                ConnectedText.SetActive(true);
                DisconnectedText.SetActive(false);
            }
        else
            {
                Debug.Log("No user is currently logged in.");
                // ConnectionStatusText.text = "Headset Disconnected";
                RTScript.SetActive(false);
                ConnectedText.SetActive(false);
                DisconnectedText.SetActive(true);
                StartCoroutine(Login());
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

    private IEnumerator Login()
    {
        //Call the Firebase auth signin function passing the email and password
        Task<AuthResult> LoginTask = auth.SignInWithEmailAndPasswordAsync("device_001@VRheadset.com", "VRheadset");
        //Wait until the task completes
        yield return new WaitUntil(predicate: () => LoginTask.IsCompleted);

        if (LoginTask.Exception != null)
        {
            //If there are errors handle them
            Debug.LogWarning(message: $"Failed to register task with {LoginTask.Exception}");
            FirebaseException firebaseEx = LoginTask.Exception.GetBaseException() as FirebaseException;
            AuthError errorCode = (AuthError)firebaseEx.ErrorCode;

            string message = "Login Failed!";
            switch (errorCode)
            {
                case AuthError.WrongPassword:
                    message = "Wrong Password";
                    break;
                case AuthError.InvalidEmail:
                    message = "Invalid Email";
                    break;
                case AuthError.UserNotFound:
                    message = "Account does not exist";
                    break;
            }
            // ConnectionStatusText.text = message;
            Debug.Log(message);
            ConnectedText.SetActive(false);
            DisconnectedText.SetActive(true);

        }
        else
        {
            //User is now logged in
            //Now get the result
            User = LoginTask.Result.User;
            Debug.LogFormat("User signed in successfully: {0} ({1})", User.DisplayName, User.Email);
            // ConnectionStatusText.text = "Headset Connected";
            ConnectedText.SetActive(true);
            DisconnectedText.SetActive(false);
        }
    }

}
