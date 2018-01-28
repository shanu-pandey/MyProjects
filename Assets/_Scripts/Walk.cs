using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Walk : MonoBehaviour {

	Transform m;
	Collider teacher;
	Collider box;
	bool move = true;
	bool rotate = true;
	public float speed = 100f;
	Animator animator;
	bool walk;

	// Use this for initialization
	void Start () {
		m = gameObject.GetComponent<Transform>();
		teacher = gameObject.GetComponentInChildren<Collider>();
		box = GameObject.FindGameObjectWithTag ("trashcan").GetComponent<Collider> ();
		animator = gameObject.GetComponent<Animator>();
		//animator.SetBool ("walk", true);
	}
	
	// Update is called once per frame
	void Update () {
		if (move)  {
			//animator.SetBool ("walk", true);
			transform.Translate (-Time.deltaTime / 2, 0, Time.deltaTime / 15, Space.World);
		}
		else if (rotate)  {
			transform.Rotate (0, -90, 0);
			rotate = false;
		}
			

		if (teacher.bounds.Intersects (box.bounds)) {
			move = false;
			animator.SetBool ("walk", false);
			}
		}
	}
