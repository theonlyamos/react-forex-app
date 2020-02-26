class RouterService {
  static get router() {
    return this._router;
  }

  static set router(router) {
    this._router = router;
  }

  static push(path, state) {
    this._router.push(path, state);
  }
}

export default RouterService;
