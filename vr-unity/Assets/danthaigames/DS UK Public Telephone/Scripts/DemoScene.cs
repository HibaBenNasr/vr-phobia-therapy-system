using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DemoScene : MonoBehaviour {

	public KeyCode toggleDoorKey = KeyCode.E;
	public DSUKPhoneBox phoneBox;

	void Update () {

		if (Input.GetKeyUp (toggleDoorKey)) {
			phoneBox.ToggleDoor ();
		}

	}
}
