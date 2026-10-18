using UnityEngine;

public class TriggerDoor : MonoBehaviour
{

    private Animator _doorAnimator;

    void Start()
    {
        _doorAnimator=GetComponent<Animator>();
    }

    private void OnTriggerEnter(Collider other)
    {
        if(other.CompareTag("person")){
            _doorAnimator.SetTrigger("open");
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if(other.CompareTag("person")){
            _doorAnimator.SetTrigger("closed");
        }
    }
}
