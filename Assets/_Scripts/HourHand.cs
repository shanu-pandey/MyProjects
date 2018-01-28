using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HourHand : MonoBehaviour {

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		//Debug.Log(transform.localRotation.x);
		transform.Rotate (0, 0, Time.deltaTime*6);
	}
}
