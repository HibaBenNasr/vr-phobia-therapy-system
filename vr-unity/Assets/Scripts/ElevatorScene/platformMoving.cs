using UnityEngine;

public class platformMoving : MonoBehaviour
{
    public bool canMove;

    // [SerializeField] float speed;
    public float speed;
    [SerializeField] int startPoint;
    [SerializeField] Transform[] points;

    public ManageLevels manageLevels;


    int i;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        transform.position = points[startPoint].position;
        i=startPoint;
    }

    // Update is called once per frame
    void Update()
    {
        if (Vector3.Distance(transform.position, points[i].position) < 0.01f)
        {
            canMove = false;
            if (i == points.Length - 1)
            {
                manageLevels.level4Ended = true;
            }
            else
            {
                manageLevels.level4Ended = false;
            }
        }
        Debug.Log("can move " + canMove);
        if (canMove)
        {
            transform.position = Vector3.MoveTowards(transform.position, points[i].position, speed * Time.deltaTime);
        }
        
    }

    public void goUp()
    {
        if (points.Length -1==i){
            canMove=false;
        }
        else{
            i++;
            canMove=true;
        }
    }
    public void goDown(){
        if (i==0){
            canMove=false;
        }
        else{
            i--;
            canMove=true;
        }   
    }
}
