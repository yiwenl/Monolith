// Drag.js

import { EventDispatcher } from 'alfrid';

const getMouse = (e) => {
	if(e.touches) {
		return {
			x:e.touches[0].pageX,
			y:e.touches[0].pageY,
		}
	} else {
		return {
			x:e.clientX,
			y:e.clientY
		}
	}
}

class Drag extends EventDispatcher {

	constructor(mListenerTarget=window) {
		super();
		this._listenerTarget = mListenerTarget;

		this._downBind = (e) => this._onDown(e);
		this._upBind = () => this._onUp();
		this._moveBind = (e) => this._onMove(e);

		this._isMouseDown = false;
		this._mouse = { x:0, y:0 };
		this._mousePress = { x:0, y:0 };

		this.connect();
	}

	connect() {
		this._listenerTarget.addEventListener('mousedown', this._downBind);
		this._listenerTarget.addEventListener('mousemove', this._moveBind);
		this._listenerTarget.addEventListener('mouseup', this._upBind);

		this._listenerTarget.addEventListener('touchstart', this._downBind);
		this._listenerTarget.addEventListener('touchmove', this._moveBind);
		this._listenerTarget.addEventListener('touchend', this._upBind);
	}

	disconnect() {
		this._listenerTarget.removeEventListener('mousedown', this._downBind);
		this._listenerTarget.removeEventListener('mousemove', this._moveBind);
		this._listenerTarget.removeEventListener('mouseup', this._upBind);

		this._listenerTarget.removeEventListener('touchstart', this._downBind);
		this._listenerTarget.removeEventListener('touchmove', this._moveBind);
		this._listenerTarget.removeEventListener('touchend', this._upBind);
	}


	_onDown(e) {
		this._isMouseDown = true;
		this._mouse = getMouse(e);
		this._mousePress = getMouse(e);

		this.trigger('onDragStart', {press:this._mousePress})
	}


	_onMove(e) {
		if(!this._isMouseDown) {
			return;
		}
		this._mouse = getMouse(e);
		const dist = {
			x:this._mouse.x - this._mousePress.x,
			y:this._mouse.y - this._mousePress.y
		}

		this.trigger('onDrag', {
			press:this._mousePress,
			mouse:this._mouse,
			dist
		});
	}

	_onUp() {
		this._isMouseDown = false;
	}

}

export default Drag;