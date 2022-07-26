import Vector from "./Vector.js";

// TODO: add jsdoc comments

export default class Mouse {
    pos = new Vector();
    down = false;

    // event listener callbacks
    onLiftCb = () => {};
    onPressCb = () => {};

    constructor(canvas) {
        this.canvas = canvas;
        this.bbox = this.canvas.canvas.getBoundingClientRect();

        this.pos.x = this.canvas.width / 2;
        this.pos.y = this.canvas.height / 2;
    }

    onLift(cb) {
        this.onLiftCb = cb;
    }

    onPress(cb) {
        this.onPressCb = cb;
    }

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

    _updateMousePos(e) {
        this.pos.x = e.clientX - this.bbox.left;
        this.pos.y = e.clientY - this.bbox.top;
    }

    _onMouseDown(e) {
        // update internals & then call down cb
        this._updateMousePos(e);
        this.down = true;
        this.onPressCb(this.canvas);
    }

    _onMouseMove(e) {
        this._updateMousePos(e);
    }

    _onMouseUp(e) {
        // update internals & then call up cb
        this._updateMousePos(e);
        this.down = false;
        this.onLiftCb(this.canvas);
    }

    // re-calculate bbox on resize
    _onResize() {
        this.bbox = this.canvas.canvas.getBoundingClientRect();
    }

    addEventListeners() {
        const { canvas } = this.canvas;
        canvas.addEventListener("mousedown", this._onMouseDown.bind(this));
        canvas.addEventListener("mousemove", this._onMouseMove.bind(this));
        canvas.addEventListener("mouseup", this._onMouseUp.bind(this));
        window.addEventListener("resize", this._onResize.bind(this));
    }

    removeEventListeners() {
        const { canvas } = this.canvas;
        canvas.removeEventListener("mousedown", this._onMouseDown);
        canvas.removeEventListener("mousemove", this._onMouseMove);
        canvas.removeEventListener("mouseup", this._onMouseUp);
        window.removeEventListener("resize", this._onResize);
    }
}
