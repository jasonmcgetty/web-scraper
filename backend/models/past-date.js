
class PastDate {
    constructor(source, location, locationZip, date, dateHigh, dateLow) {
        this.source = source;
        this.location = location;
        this.locationZip = locationZip;
        this.date = date;
        this.dateHigh = dateHigh;
        this.dateLow = dateLow;
    }
    
    getSource() {
        return this.source;
    }
    getLocation() {
        return this.location;
    }
    getLocationZip() {
        return this.locationZip;
    }
    getDate() {
        return this.date;
    }
    getDateHigh() {
        return this.dateHigh;
    }
    getDateLow() {
        return this.dateLow;
    }
}
module.exports = PastDate;