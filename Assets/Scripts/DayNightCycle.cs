using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class DayNightCycle : MonoBehaviour {

    [SerializeField]
    private float m_speed = 1f;


    private bool bMorning = false;
    private bool bEvening = false;
    private bool bNight = false;

    public UnityEvent Morning;
    public UnityEvent Evening;
    public UnityEvent Night;


    // Use this for initialization
    void Start () {
		
	}

    // Update is called once per frame
    private void Update()
    {
        Debug.Log(transform.rotation.eulerAngles.x);
        if (transform.rotation.x >0 && transform.rotation.x <= 90)
        {
            if (!bMorning)
            {
                Morning.Invoke();
                bMorning = true;
                bEvening = false;
                bNight = false;
            }            
        }
        else if (transform.rotation.x > 90 && transform.rotation.x <= 180)
        {
            if (!bEvening)
            {
                Evening.Invoke();
                bMorning = false;
                bEvening = true;
                bNight = false;                
            }
            
        }
        else
        {
            if (!bNight)
            {
                Night.Invoke();
                bMorning = false;
                bEvening = false;
                bNight = true;
            }
            
        }
    }

    void FixedUpdate () {
        transform.Rotate(m_speed, 0, 0);
	}
}
