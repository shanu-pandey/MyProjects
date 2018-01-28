using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TeleportClock : MonoBehaviour {

	// Use this for initialization
	public float teleportTime = 10.0f;
	float initialXPos;
	bool flip = true;
	void Start () {
		initialXPos = transform.localPosition.x;
	}
	
	// Update is called once per frame
	void Update () {
		//Debug.Log ("time: "+Time.time);
		if (Time.time > teleportTime) {
			//Debug.Log(transform.localPosition.x);
//			transform.Rotate (0, 0, Time.deltaTime*600);
			Debug.Log(initialXPos);
			//transform.SetPositionAndRotation(Vector3(450, transform.position.y, transform.position.z), transform.localRotation);
			if (flip) {
				transform.localPosition = new Vector3(-300f, transform.localPosition.y, transform.localPosition.z);
//				transform.localPosition.Set(300f, transform.localPosition.y, transform.localPosition.z);
				transform.RotateAround (transform.position, Vector3.up, 180f);
				flip = false;
			} else {
				transform.localPosition = new Vector3(initialXPos, transform.localPosition.y, transform.localPosition.z);
				transform.RotateAround (transform.position, Vector3.up, 180f);
				flip = true;

			}


		//	Debug.Log(transform.localPosition.x);
			teleportTime += 10f;
		}

	}
}
