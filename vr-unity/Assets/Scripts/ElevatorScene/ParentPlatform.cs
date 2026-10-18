using UnityEngine;

public class ParentPlatform : MonoBehaviour
{
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void OnTriggerEnter(Collider collision)
    {
        collision.transform.SetParent(transform);
    }

    void OnTriggerExit(Collider collision)
    {
        collision.transform.SetParent(null);
    }
}
