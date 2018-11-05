using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class PlayerController : MonoBehaviour {

    [SerializeField]
    private float m_speed = 10f;

    private Vector3 m_moveDir = Vector3.zero;
    private CharacterController m_controller;

    public UnityEvent Danger;
    public UnityEvent Happy;

	// Use this for initialization
	void Start ()
    {
        m_controller = this.GetComponent<CharacterController>();		
	}

    // Update is called once per frame
    void Update()
    {
        m_moveDir = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
        m_moveDir = transform.TransformDirection(m_moveDir);
        m_moveDir *= m_speed;
        m_controller.Move(m_moveDir * Time.deltaTime);

        if (Input.GetKeyDown(KeyCode.X))
        {
            Danger.Invoke();
        }

        if (Input.GetKeyDown(KeyCode.Z))
        {
            Happy.Invoke();
        }

    }
}
