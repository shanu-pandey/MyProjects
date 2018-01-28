using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class gazeTrigger : MonoBehaviour {

	// Use this for initialization
	public TextMesh _activeMesh;
	public RaycastHit hit;
	int[] easy = {0, 2, 1, 5, 4, 3, 6, 7, 9, 8, 10, 12, 11, 13, 14, 15, 17, 16, 18, 19, 22, 20, 21, 23, 24, 25};
	int[] medium = { 0, 2, 3, 1, 5, 4, 6, 8, 10, 7, 9, 12, 11, 13, 14, 17, 15, 16, 18, 19, 21, 20, 23, 24, 22, 25 };
	int[] hard = { 0, 2, 3, 5, 1, 4, 6, 8, 10, 7, 9, 12, 11, 14, 13, 17, 15, 16, 19, 18, 22, 20, 23, 24, 21, 25 };
	char[] similar1 = { 'B', 'D', 'P' };
	char[] similar2 = { 'b', 'd', 'p', 'q' };
	char[] similar3 = { 'Q', 'O', 'C', 'U'};
	char[] similar4 = { 'c', 'o', 'u'};
	char[] similar5 = { 'E', 'F'};
	char[] similar6 = { 'T', 'I', 'L' };
	char[] similar7 = { 'V', 'A'};
	char[] similar8 = { '0', '9', '6', '8', '3' };
	char[] similar9 = { '1', '7', '4' };
	char[] similar10 = { '2', '5' };

	public int _tempIndex = 0;

	GameObject[] _whiteboard;
	TextMesh[] _textMesh;
	string[] original = new string[4];
	string copy;
	float x, y, z;
	float jumbleTime = 0.5f;
	float flipTime = 2f;
	string difficulty;
	bool[] makeRandom;// = {true, true, true, true};
	int _activeIndex;
	bool check = true;

	void Start () {
		difficulty = "hard";

		_whiteboard = GameObject.FindGameObjectsWithTag("JumbleText");

        original = new string[_whiteboard.Length];
        _textMesh = new TextMesh[_whiteboard.Length];
		string[] name = new string[_whiteboard.Length];
		makeRandom = new bool[_whiteboard.Length];

        for (int i = 0; i < _whiteboard.Length; i++) {
            _textMesh[i] = _whiteboard[i].GetComponent<TextMesh>();
            original [i] = _textMesh [i].text;
			name [i] = _textMesh [i].name;
			makeRandom [i] = true;
        }

	}
	
	// Update is called once per frame
	void FixedUpdate()
	{
		//Debug.Log ("Start");

		int i = 0;
		Vector3 fwd = transform.TransformDirection (Vector3.forward)*10;
		Debug.DrawRay(transform.position, fwd, Color.green);
		if (Time.time > jumbleTime) {
			foreach (TextMesh _currentMesh in _textMesh) {
				_activeIndex = i;
				//i++;
				check = true;
				string tag = _currentMesh.tag;
				tag = tag + _activeIndex;
				//print (_currentMesh.tag);
				if (makeRandom [_activeIndex]) {
					StartRandom (_currentMesh);
				}
				if (hit.collider && hit.collider.tag == _currentMesh.tag) {
					print ("Still Hit");
				} else {
					makeRandom[_activeIndex] = true;
				}

				if (Physics.Raycast (transform.position, fwd, out hit)) {
					//print (hit.collider.tag);
					if (hit.collider && hit.collider.name == _currentMesh.name) {

//						string tem = hit.collider.GetComponent<TextMesh> ().text;
//						foreach(char c in original[i]) {
//							if (hit.collider.GetComponent<TextMesh> ().text.IndexOf (c) == -1) {
//								check = false;
//							}
//						}
						Debug.Log (hit.collider.GetComponent<TextMesh> ().text);
						StartCoroutine(CallCollisionCheck(_activeIndex));
					}
				}
				i++;
			}
			jumbleTime += 1f;
			i = 0;
		}
	}

	IEnumerator CallCollisionCheck(int _tempIndex)	{
		yield return new WaitForSeconds(3f);
		CheckCollision(_tempIndex);
	}

	void CheckCollision(int i_index) {
		print (i_index);
		Vector3 fwd2 = transform.TransformDirection (Vector3.forward);
			if (Physics.Raycast (transform.position, fwd2, out hit)) {
			if (hit.collider && hit.collider.tag == "JumbleText") {
				makeRandom[i_index] = false;
				_textMesh[i_index].text = original[i_index];
				print ("After dealy"+ _tempIndex + makeRandom[i_index]);
				}
			}
	
	}
					

	public void StartRandom(TextMesh i_mesh)	{
		string randomText = RandomText (i_mesh.text, difficulty);
		randomText = SimilarWords (randomText);
		i_mesh.text = randomText;		

	}

	public string RandomText(string word, string difficulty)	{

		string random = "";

		switch (difficulty)
		{
		case "easy":
			for (int i = 0; i < word.Length; i++)
			{
				int temp = easy[i];
				while (temp > word.Length - 1) {
					temp = easy [i + 1];
					i++;
				}
				random += word[temp]; 
			}
			break;

		case "medium":
			for (int i = 0; i < word.Length; i++)
			{
				int temp = medium[i];
				while (temp > word.Length - 1)
					temp--;
				random += word[temp];
			}
			break;

		case "hard":
			for (int i = 0; i < word.Length; i++)
			{
				int temp = hard[i];
				while (temp > word.Length - 1)
					temp--;
				random += word[temp];
			}
			break;
		}
		return random;
	}

	Text Mirror(Text s)
	{
		//Debug.Log(s.rectTransform.localScale.x);
		s.rectTransform.localScale = new Vector3(s.rectTransform.localScale.x * -1, s.rectTransform.localScale.y, s.rectTransform.localScale.z);
		return s;
	}

	string SimilarWords(string word) {
		int randomNumber = 0;

		for (int i=0; i<word.Length; i++)
		{
			if (System.Array.IndexOf(similar1, word[i]) != -1)
			{
				randomNumber = Random.Range(0, similar1.Length - 1);
				word = word.Replace(word[i], similar1[randomNumber]);
			}
			else if (System.Array.IndexOf(similar2, word[i]) != -1)
			{
				randomNumber = Random.Range(0, similar2.Length - 1);
				word = word.Replace(word[i], similar2[randomNumber]);
			}
			else if (System.Array.IndexOf(similar3, word[i]) != -1)
			{
				randomNumber = Random.Range(0, similar3.Length - 1);
				word = word.Replace(word[i], similar3[randomNumber]);
			}
			else if (System.Array.IndexOf(similar4, word[i]) != -1)
			{
				randomNumber = Random.Range(0, similar4.Length - 1);
				word = word.Replace(word[i], similar4[randomNumber]);
			}
			else if (System.Array.IndexOf(similar5, word[i]) != -1)
			{
				randomNumber = Random.Range(0, similar5.Length - 1);
				word = word.Replace(word[i], similar5[randomNumber]);
			}
			else if (System.Array.IndexOf(similar6, word[i]) != -1)
			{
				randomNumber = Random.Range(0, similar6.Length - 1);
				word = word.Replace(word[i], similar6[randomNumber]);
			}
			else if (System.Array.IndexOf(similar7, word[i]) != -1)
			{
				randomNumber = Random.Range(0, similar7.Length - 1);
				word = word.Replace(word[i], similar7[randomNumber]);
			}
			else if (System.Array.IndexOf(similar8, word[i]) != -1)
			{
				randomNumber = Random.Range(0, similar8.Length - 1);
				word = word.Replace(word[i], similar8[randomNumber]);
			}
			else if (System.Array.IndexOf(similar9, word[i]) != -1)
			{
				randomNumber = Random.Range(0, similar9.Length - 1);
				word = word.Replace(word[i], similar9[randomNumber]);
			}
			else if (System.Array.IndexOf(similar10, word[i]) != -1)
			{
				randomNumber = Random.Range(0, similar10.Length - 1);
				word = word.Replace(word[i], similar10[randomNumber]);
			}
		}
		return word;
	}

}


