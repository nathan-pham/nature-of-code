import Vector from "./Vector.js";

export default class Mouse {
    pos = new Vector();
    down = false;

    // event listener callbacks
    onUpCb = () => {};
    onDownCb = () => {};

    constructor(canvas) {
        this.canvas = canvas;
    }

    onUp(cb) {
        this.onUpCb = cb;
    }

    onDown(cb) {
        this.onDownCb = cb;
    }

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

    _updateMousePos(e) {
        const bbox = this.canvas.canvas.getBoundingClientRect();
        this.pos.x = e.clientX - bbox.left;
        this.pos.y = e.clientY - bbox.top;
    }

    _onMouseDown(e) {
        // update internals & then call down cb
        this._updateMousePos(e);
        this.down = true;
        this.onDownCb(this);
    }

    _onMouseMove(e) {
        this._updateMousePos(e);
    }

    _onMouseUp(e) {
        // update internals & then call up cb
        this._updateMousePos(e);
        this.down = false;
        this.onUpCb(this);
    }

    addEventListeners() {
        const { canvas } = this.canvas;
        canvas.addEventListener("mousedown", this._onMouseDown.bind(this));
        canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
        canvas.addEventListener("mouseup", this._onMouseUp.bind(this));
    }

    removeEventListeners() {
        const { canvas } = this.canvas;
        canvas.removeEventListener("mousedown", this._onMouseDown);
        canvas.removeEventListener("mousemove", this._onMouseMove);
        canvas.removeEventListener("mouseup", this._onMouseUp);
    }
}
