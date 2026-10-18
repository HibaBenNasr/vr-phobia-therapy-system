using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DSUKPhoneBox : MonoBehaviour {

	private Animator _animator;

	void Start() {
		_animator = GetComponent<Animator> ();
	}

	public void Open() {

		if (_animator != null) {
			_animator.SetBool ("isOpen", true);
		}

	}

	public void Close() {

		if (_animator != null) {
			_animator.SetBool ("isOpen", false);
		}

	}

	public void ToggleDoor() {

		if (_animator != null) {
			_animator.SetBool ("isOpen", !_animator.GetBool ("isOpen"));
		}

	}
}
