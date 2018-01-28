using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using VRTK;

public class FadeManager : MonoBehaviour {

    VRTK_HeadsetFade headsetFade;
    bool fade;

    public Transform player;

    public GameObject titlePlane;
    public PlayOnTrigger playOnTrigger;

    int fadeCount;

	// Use this for initialization
	void Start () {
        headsetFade = GetComponent<VRTK_HeadsetFade>();
        fadeCount = 0;
	}
	
	// Update is called once per frame
	void Update () {
	    if(fade)
        {
            if(headsetFade.IsFaded())
            {
                fade = false;
            }
        }

        if (!fade && headsetFade.IsFaded())
        {
            player.position = new Vector3(0, 0, 0);
            headsetFade.Unfade(3);
            titlePlane.SetActive(false);
            playOnTrigger.Resume();

            if(fadeCount >= 2)
            {
                SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
            }
        }

        if(Input.GetKeyDown(KeyCode.Space))
        {
            Fade();
        }
	}

    public void Fade()
    {
        fadeCount++;
        fade = true;
        headsetFade.Fade(Color.white, 3);
    }
}
