using UnityEngine;
using UnityEngine.Playables;
using UnityEngine.Timeline;
using System.Collections;

public class ControlAnimation : MonoBehaviour
{

    public int level=0;
    public PlayableDirector director;

    // Loop bounds
    private double loopStart = 0;
    private double loopEnd = 0;
    private double frameRate = 30;

    private bool LevelOnehasPlayedOnce = false;


    void Start()
    {
        // Get actual frame rate from Timeline asset
        if (director.playableAsset is TimelineAsset timelineAsset)
        {
            frameRate = timelineAsset.editorSettings.frameRate;
        }
        else
        {
            Debug.LogWarning("PlayableAsset is not a TimelineAsset. Using default frame rate of 30.");
        }
    }


    void Update()
    {
        switch (level)
        {
            case 0:
                loopStart = FrameToTime(0);
                loopEnd = FrameToTime(10); 
                PlayAndLoopSegment(loopStart, loopEnd);
                break;

            case 1:
                loopStart = FrameToTime(0);
                loopEnd = FrameToTime(1200); 
                PlayOnceThenPause(loopStart, loopEnd);
                
                break;

            case 2:
                loopStart = FrameToTime(1201);
                loopEnd = FrameToTime(2300); // Frames 90–150
                PlayAndLoopSegment(loopStart, loopEnd);
                break;
            case 3:
                loopStart = FrameToTime(2301);
                loopEnd = FrameToTime(4000); // Frames 90–150
                PlayAndLoopSegment(loopStart, loopEnd);
                break;
            case 4:
                loopStart = FrameToTime(4001);
                loopEnd = FrameToTime(6000); // Frames 90–150
                PlayAndLoopSegment(loopStart, loopEnd);
                break;
            case 5:
                loopStart = FrameToTime(6001);
                loopEnd = FrameToTime(7349); // Frames 90–150
                PlayAndLoopSegment(loopStart, loopEnd);
                break;
        }
    }

    void PlayAndLoopSegment(double start, double end)
    {
        // If we're outside the loop bounds, jump back to start
        if (director.time < start || director.time > end)
        {
            director.time = start;
            director.Play();
            return;
        }

        // Start playing if not already
        if (director.state != PlayState.Playing)
        {
            director.Play();
        }

        // Smooth loop reset
        double loopThreshold = 0.01;
        if (director.time >= end - loopThreshold)
        {
            director.time = start;
            director.Play();
        }
        }

    void PlayOnceThenPause(double start, double end)
{
    if (LevelOnehasPlayedOnce)
        return;

    // Set start time if timeline is stopped or out of bounds
    if (director.state != PlayState.Playing && (director.time < start || director.time > end))
    {
        director.time = start;
        director.Play();
    }

    // Play if not already playing
    if (director.state != PlayState.Playing)
    {
        director.Play();
    }

    // Pause when finished
    if (director.time >= end)
    {
        director.Pause();
        LevelOnehasPlayedOnce = true;
    }
}


    double FrameToTime(int frame)
    {
        return frame / frameRate;
    }


}
