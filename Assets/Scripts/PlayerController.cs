using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour {

    [SerializeField]
    private float m_speed = 10f;

    private Vector3 m_moveDir = Vector3.zero;

    private CharacterController m_controller;
	// Use this for initialization
	void Start ()
    {
        m_controller = this.GetComponent<CharacterController>();		
	}
	
	// Update is called once per frame
	void Update ()
    {
        if (m_controller.isGrounded)
        {
            m_moveDir = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
            m_moveDir = transform.TransformDirection(m_moveDir);
            m_moveDir *= m_speed;
            m_controller.Move(m_moveDir * Time.deltaTime);
        }
	}
}
