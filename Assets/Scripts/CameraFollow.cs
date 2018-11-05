using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraFollow : MonoBehaviour {

    [SerializeField]
    private Transform m_playerTransform = null;

    [SerializeField]
    private float m_smoothFactor = 0.5f;

    private bool bLookAtPlayer = false;
    private Vector3 m_cameraOffset;

    
	// Use this for initialization
	void Start ()
    {
        m_cameraOffset = transform.position - m_playerTransform.position;		
	}
	
	// Update is called once per frame
	void FixedUpdate ()
    {
        Vector3 newPosition = m_playerTransform.position + m_cameraOffset;
        transform.position = Vector3.Slerp(transform.position, newPosition, m_smoothFactor);

        if (bLookAtPlayer)
            transform.LookAt(m_playerTransform);
	}
}
