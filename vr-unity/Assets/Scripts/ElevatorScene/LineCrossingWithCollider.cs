using UnityEngine;

public class LineCrossingWithCollider : MonoBehaviour
{
    public ManageLevels manageLevels;
    public GameObject celebrationEffect;
    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            Debug.Log("Player has crossed the line!");
            manageLevels.level5Ended = true;
            if (celebrationEffect != null)
            {
                celebrationEffect.SetActive(true);

                // Optionally play the sound and particle manually
                var audio = celebrationEffect.GetComponentInChildren<AudioSource>();
                if (audio != null) audio.Play();

                var particle = celebrationEffect.GetComponentInChildren<ParticleSystem>();
                if (particle != null) particle.Play();
            }
            // manageLevels.level5Ended = false;
        }

        Debug.Log("Player has crossed the line! out");
    }

    private void OnTriggerExit(Collider other)
    {
         if (other.CompareTag("Player"))
        {
            Debug.Log("Player left the point!");
            manageLevels.level5Ended = false;

            if (celebrationEffect != null)
            {
                celebrationEffect.SetActive(false);
            }
        }
    }

}
