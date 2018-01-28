using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class JumbleMirror : MonoBehaviour
{

    Text _text1;
    string copy;
    string word = "";
    float x, y, z;
    float jumbleTime = 0.5f;
    float flipTime = 2f;

    //public Text score;
    // Use this for initialization
    void Start()
    {
        _text1 = GetComponent<UnityEngine.UI.Text>();
        copy = _text1.text;
        copy += " ";
        x = _text1.rectTransform.localScale.x;
        y = _text1.rectTransform.localScale.y;
        z = _text1.rectTransform.localScale.z;
    }

    // Update is called once per frame
    void Update()
    {
        if (Time.time > jumbleTime)
        {
            _text1.text = "";
            for (int i = 0; i < copy.Length; i++)
            {
                if (copy[i] == ' ')
                {
                    _text1.text += GetRandom(word);
                    _text1.text += " ";
                    word = "";
                }
                else
                {
                    word += copy[i];
                }
            }
            jumbleTime += 0.5f;
        }
        // Debug.Log("Time: "+Time.time + "Jumble: "+ jumbleTime);
        if (Time.time > flipTime)
        {
            Debug.Log(flipTime);
            x = -x;
            // _text1.rectTransform.localScale = new Vector3(x, y, z);//,2f,2f);
            flipTime += 2f;
        }
    }
    string GetRandom(string s)
    {

        string randomString = "";
        string randomNumber = "";
        while (randomNumber.Length < s.Length)
        {
            int j = Random.Range(0, s.Length);
            string l = System.Convert.ToString(j);
            if (!randomNumber.Contains(l))
            {
                randomString += s[j];
                randomNumber += (j);
            }
        }
        return randomString;
    }

    Text Mirror(Text s)
    {
        Debug.Log(s.rectTransform.localScale.x);
        s.rectTransform.localScale = new Vector3(s.rectTransform.localScale.x * -1, s.rectTransform.localScale.y, s.rectTransform.localScale.z);
        return s;
    }
}
