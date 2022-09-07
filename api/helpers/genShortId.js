const { random } = require("lodash");

exports.genShortId = async(from, to, model) => {
    let rand;
    let resp = null;
    do {
        rand = random(from, to);
        resp = await model.findOne({ short_id: rand });
    }
    while (resp != null);
    return rand;
}