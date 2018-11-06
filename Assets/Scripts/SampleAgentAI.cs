﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public enum Behavior { Timid, Brave, Indifferent};


public class SampleAgentAI : MonoBehaviour {

    [SerializeField]
    bool bPatrolWaiting;

    [SerializeField]
    float m_totalWaitTime = 3.0f;

    [SerializeField]
    float m_switchProbability = 0.2f;

    [SerializeField]
    float m_reactionRadius = 50.0f;

    [SerializeField]
    List<PatrolPoint> m_PatrolPoints = null;

    [SerializeField]
    private Transform m_home;

    [SerializeField]
    private PlayerController m_player = null;

    [SerializeField]
    private Behavior m_behavior;// = null;

    [SerializeField]
    private DayNightCycle m_dayNightManager;


    private NavMeshAgent m_naveMeshAgent;
    private int m_currentPatrolIndex;
    bool bExternalEvent = false;
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
        else
        {
            GoHome();
        }

        m_player.Danger.AddListener(DangerAction);
        m_player.Happy.AddListener(HappyAction);
        m_player.Apocalypse.AddListener(Apocalypse);

        m_dayNightManager.Morning.AddListener(MorningEvent);
        m_dayNightManager.Evening.AddListener(EveningEvent);
        m_dayNightManager.Night.AddListener(NightEvent);
    }
	
	// Update is called once per frame
	void Update ()
    {
        if (!bExternalEvent)
        {

            if (bTravelling && m_naveMeshAgent.remainingDistance <= 1.0f)
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
	}

    private void SetDestination()
    {
        if (m_PatrolPoints != null)
        {
            Vector3 target = m_PatrolPoints[m_currentPatrolIndex].transform.position;
            m_naveMeshAgent.SetDestination(target);
            bTravelling = true;
        }
    }

    private void ChangePatrolPoint()
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

    private void DangerAction()
    {
        if ((transform.position - m_player.transform.position).magnitude <= m_reactionRadius)
        {
            bExternalEvent = true;
            m_naveMeshAgent.isStopped = true;
            if (m_behavior == Behavior.Timid)
            {
                float time = Random.Range(1f, 3f);
                StartCoroutine(RunAway(time));
            }
            else if (m_behavior == Behavior.Brave)
            {
                StartCoroutine(Confront());
            }
        }
    }

    private void HappyAction()
    {
        if ((transform.position - m_player.transform.position).magnitude <= m_reactionRadius)
        {
            m_naveMeshAgent.isStopped = false;
        }        
    }

    private void GoHome()
    {       
        m_naveMeshAgent.isStopped = false;
        m_naveMeshAgent.SetDestination(m_home.position);        
    }

    private IEnumerator Confront()
    {
        float time = Random.Range(1f, 3f);
        yield return new WaitForSeconds(time);
        m_naveMeshAgent.isStopped = false;
        float offset = Random.Range(3f, 15f);
        Vector3 target = m_player.transform.position - new Vector3(offset, 0, offset);
        m_naveMeshAgent.SetDestination(target);
        bPatrolWaiting = true;
    }

    private IEnumerator RunAway(float i_time)
    {        
        yield return new WaitForSeconds(i_time);
        GoHome();
    }

    private void Apocalypse()
    {
        bExternalEvent = true;
        m_naveMeshAgent.isStopped = true;
        float time = Random.Range(3f, 8f);
        StartCoroutine(RunAway(time));
    }

    private void MorningEvent()
    {
        Debug.Log("Do Morning");
    }

    private void EveningEvent()
    {
        Debug.Log("Do Evening");
    }

    private void NightEvent()
    {
        Debug.Log("Do Night");
    }    
}
