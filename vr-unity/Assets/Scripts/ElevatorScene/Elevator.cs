using UnityEngine;

public class elevator : MonoBehaviour
{

    public int maxHeight;
    public int minHeight;
    public int timeToMove;

    [SerializeField] public GameObject elev;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void OnTriggerStayUp(){
            if (elev.transform.position.y < maxHeight){
                // transform.DOMoveY(maxHeight, timeToMove);

                transform.position = Vector2.up;
                Debug.Log("up");
            
        }
    }

    public void OnTriggerStayDown(){
            if (elev.transform.position.y > minHeight){
                // transform.DOMoveY(minHeight, timeToMove * 2);
                Debug.Log("down");
                transform.position = Vector2.down;
            }
        
    }
}
