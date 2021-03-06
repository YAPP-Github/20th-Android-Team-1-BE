const stringUtill = {
  isUUIDV4(uuid: string) {
    return uuid.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
  }
};

export default stringUtill;
