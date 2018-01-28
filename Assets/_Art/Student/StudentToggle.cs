using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StudentToggle : MonoBehaviour {

    Animator m;

    bool idle;
    bool read;

    // Use this for initialization
    void Start()
    {
        m = gameObject.GetComponent<Animator>();
        AnimatorStateInfo state = m.GetCurrentAnimatorStateInfo(0);
        m.Play(state.fullPathHash, -1, Random.Range(0f, 1f));

        idle = false;
        read = false;
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKey(KeyCode.Space))
        {
            idle = false;
            read = true;
        }
        else
        {
            idle = true;
            read = false;
        }

        if (idle == true)
        {
            m.SetBool("idle", true);
        }
        else
        {
            m.SetBool("idle", false);
        }

        if (read == true)
        {
            m.SetBool("read", true);
        }
        else
        {
            m.SetBool("read", false);
        }
    }
}
