using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpreadSheetLogo : MonoBehaviour {

    Animator animator;
	// Use this for initialization
	void Start () {
        animator = GetComponent<Animator>();
	}
	
	// Update is called once per frame
	void Update () {
        animator.speed = Random.Range(0.1f, 0.2f);	
	}
}
