using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AIController : MonoBehaviour {

    [SerializeField]
    private float sensorLength = 0.0f;

    [SerializeField]
    private float speed = 10.0f;  

    [SerializeField]
    private float turnSpeed = 50.0f;

    [SerializeField]
    private float direction = 1.0f;
    [SerializeField]
    private float turnValue = 0.0f;

    Collider myCollider;

    // Use this for initialization
    void Start () {
        myCollider = gameObject.GetComponent<Collider>();
	}
	
	// Update is called once per frame
	void Update () {
        RaycastHit hit;
        int flag = 0;
        #region Check if hitting anything

        //Right Check
        if (Physics.Raycast(transform.position, transform.right, out hit, (sensorLength + transform.localScale.x)))
        {
            //if (hit.collider.tag != "wall" || hit.collider == myCollider)
            //{
            //    return;
            //}

            turnValue -= 1;
            flag++;
        }

        //Left Check
        if (Physics.Raycast(transform.position, -transform.right, out hit, (sensorLength + transform.localScale.x)))
        {
            //if (hit.collider.tag != "wall" || hit.collider == myCollider)
            //{
            //    return;
            //}

            turnValue += 1;
            flag++;
        }

        //Forward Check
        if (Physics.Raycast(transform.position, transform.forward, out hit, (sensorLength + transform.localScale.z)))
        {
            //if (hit.collider.tag != "wall" || hit.collider == myCollider)
            //{
            //    return;
            //}

            if (direction == 1.0f)
                direction = -1.0f;

            flag++;
        }

        //Backward Check
        if (Physics.Raycast(transform.position, -transform.forward, out hit, (sensorLength + transform.localScale.z)))
        {
            //if (hit.collider.tag != "wall" || hit.collider == myCollider)
            //{
            //    return;
            //}

            if (direction == -1.0f)
                direction = 1.0f;

            flag++;
        }
        #endregion

        if (flag == 0)
        {
            //can be used to give dynamic behavior of not just travelling in a straight line - test with full AI
            if (turnValue == 0)
                turnValue = 5f;
            else
                turnValue = 0;
        }

        transform.Rotate(Vector3.up * turnSpeed * turnValue * Time.deltaTime);
        transform.position += transform.forward * speed * direction * Time.deltaTime;
	}

    private void OnDrawGizmos()
    {
        Gizmos.DrawRay(transform.position, transform.forward * (sensorLength + transform.localScale.z));
        Gizmos.DrawRay(transform.position, -transform.forward * (sensorLength + transform.localScale.z));
        Gizmos.DrawRay(transform.position, transform.right * (sensorLength + transform.localScale.x));
        Gizmos.DrawRay(transform.position, -transform.right * (sensorLength + transform.localScale.x));
    }
}
