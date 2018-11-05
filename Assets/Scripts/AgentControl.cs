using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class AgentControl : MonoBehaviour {

    [SerializeField]
    private Transform m_home;

    NavMeshAgent agent;

	// Use this for initialization
	void Start () {
        agent = this.GetComponent<NavMeshAgent>();
        agent.SetDestination(m_home.position);
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
