//TODO will create a new tracker, get it and create a json and return it
var tracker = get_whole_tracker();


function get_json(username, issue){
  var json = {
      "statusId": 1,
      "priority": 1,
      "openDate": issue['created_at'], //(with some parsing done)
      "closeDate": issue['closed_at'], // (with some parsing done, see if null is allowed)
      "summary": issue['title'],
      "details": null,
      "tracker": tracker,
      "waitingFor": 100,
      "sprint": {
        "id": null,
        "alias": "sprint",
        "fieldId": null,
        "fieldName": "sprint",
        "fieldType": null,
        "fieldData": null,
        "fieldElements": null,
        "fieldOrder": null
      },
      "submittedBy": get_user(username),
      "lastModifiedDate": issue['updated_at'], //(with some parsing done)
      "lastModifiedBy": get_user(username),
      "sortOrder": null,
      "parent": 0,
      "hasSubitems": false,
      "subitemsCount": 0,
      "rel": {
        "assignees": get_user(username)
      },
      "extraFields": {
        "status": {
          "id": 67773,
          "alias": "status",
          "fieldId": 67773,
          "fieldName": "Status",
          "fieldType": 7,
          "fieldData": {
            "id": 280792,
            "alias": "todo",
            "elementName": "To Do",
            "statusId": 1
          },
          "fieldElements": null,
        "fieldOrder": 0
      }
    }
  };
  return json;
}

function get_user(username){

}

function get_whole_tracker(){

}