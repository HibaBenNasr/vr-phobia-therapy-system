using System.Collections;
using UnityEngine;

public class Teleporting : MonoBehaviour
{

    // Reference to the XR Origin (can be assigned in the Inspector)
    public Transform xrOrigin;

    // Predefined teleportation positions for different levels
    public Vector3 level0Position;
    public Vector3 level1Position;
    public Vector3 level2Position;
    public Vector3 level3Position;
    public Vector3 level4Position;
    public Vector3 level5Position;

    // Reference to the PlayerLevel script to get the current level
    public ManageLevels playerLevel;
    private platformMoving platformMoving;

    public GameObject elevator;

    private int previousLevel = -1;

    void Start()
    {
        if (elevator != null)
        {
            platformMoving = elevator.GetComponent<platformMoving>();
        }
        else
        {
            Debug.LogError("Object A is not assigned!");
        }
    }


    // Update is called once per frame
    void Update()
    {
        if (playerLevel != null && playerLevel.currentLevel != previousLevel)
        {
            if (playerLevel.currentLevel < 5)
            {
                platformMoving.speed = 20;
                platformMoving.goDown();
            }
            previousLevel = playerLevel.currentLevel;
            TeleportPlayerBasedOnLevel(playerLevel.currentLevel);
        }

    }

    // Teleports the player based on the level value
    private void TeleportPlayerBasedOnLevel(int level)
    {
        switch (level)
        {
            case 0:
                TeleportToPosition(level0Position);
                break;
            case 1:
                TeleportToPosition(level1Position);
                break;

            case 2:
                TeleportToPosition(level2Position);
                break;

            case 3:
                TeleportToPosition(level3Position);
                break;
            case 4:
                TeleportToPosition(level4Position);
                StartCoroutine(MoveObjectAWithDelay(5f));
                break;
            case 5:
                TeleportToPosition(level5Position);
                break;

            default:
                Debug.LogWarning("Invalid level. No teleportation.");
                break;
        }
    }

    // Teleport to a given position
    private void TeleportToPosition(Vector3 targetPosition)
    {
        if (xrOrigin != null)
        {
            xrOrigin.position = targetPosition;
            Debug.Log($"Teleported to position: {targetPosition}");
        }
        else
        {
            Debug.LogError("XR Origin is not assigned!");
        }
    }

    // Coroutine to move Object A after a delay
    private IEnumerator MoveObjectAWithDelay(float delay)
    {
        yield return new WaitForSeconds(delay); // Wait for the specified time

        if (platformMoving != null)
        {
            platformMoving.speed = 5;
            platformMoving.goUp();  // Call goUp() after the delay
        }
        else
        {
            Debug.LogError("MovingScript is not assigned to Object A.");
        }
    }   
}
