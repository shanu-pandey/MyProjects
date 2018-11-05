using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class SampleAgentAI : MonoBehaviour {

    [SerializeField]
    bool bPatrolWaiting;

    [SerializeField]
    float m_totalWaitTime = 3.0f;

    [SerializeField]
    float m_switchProbability = 0.2f;

    [SerializeField]
    List<PatrolPoint> m_PatrolPoints = null;

    [SerializeField]
    private Transform m_home;

    private NavMeshAgent m_naveMeshAgent;
    private int m_currentPatrolIndex;
    bool bTravelling;
    bool bWaiting;
    bool bPatrolForward;
    float m_waitTimer;


    // Use this for initialization
    void Start ()
    {
        m_naveMeshAgent = this.GetComponent<NavMeshAgent>();
		
        if (m_PatrolPoints != null && m_PatrolPoints.Count >=2)
        {
            m_currentPatrolIndex = 0;
            SetDestination();
        }
	}
	
	// Update is called once per frame
	void Update ()
    {
        if (bTravelling && m_naveMeshAgent.remainingDistance <=1.0f)
        {
            bTravelling = false;

            if (bPatrolWaiting)
            {
                bWaiting = true;
                m_waitTimer = 0.0f;
            }
            else
            {
                ChangePatrolPoint();
                SetDestination();
            }
        }

        if (bWaiting)
        {
            m_waitTimer += Time.deltaTime;
            if (m_waitTimer >= m_totalWaitTime)
            {
                bWaiting = false;
                ChangePatrolPoint();
                SetDestination();
            }
        }
	}

    public void SetDestination()
    {
        if (m_PatrolPoints != null)
        {
            Vector3 target = m_PatrolPoints[m_currentPatrolIndex].transform.position;
            m_naveMeshAgent.SetDestination(target);
            bTravelling = true;
        }
    }

    public void ChangePatrolPoint()
    {
        if (Random.Range(0f, 1f) <= m_switchProbability)
        {
            bPatrolForward = !bPatrolForward;
        }

        if (bPatrolForward)
        {
            //current patrol index should not exceed total patrol points
            m_currentPatrolIndex = (m_currentPatrolIndex + 1) % m_PatrolPoints.Count;
        }
        else
        {
            if (--m_currentPatrolIndex < 0)
            {
                m_currentPatrolIndex = m_PatrolPoints.Count - 1;
            }
        }
    }
}
