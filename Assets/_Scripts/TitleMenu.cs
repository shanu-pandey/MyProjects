using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TitleMenu : MonoBehaviour {
    public FadeManager fadeManager;
	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    public void Play()
    {
        fadeManager.Fade();
    }

    public void Exit()
    {
        Application.Quit();
    }
}
