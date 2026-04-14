import Principal "mo:core/Principal";

module {
  public type TaskId = Text;

  public type Task = {
    id : TaskId;
    owner : Principal;
    title : Text;
    description : Text;
    completed : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  public type CreateTaskResult = { #ok : Task; #err : Text };
  public type UpdateTaskResult = { #ok : Task; #err : Text };
  public type ToggleTaskResult = { #ok : Task; #err : Text };
  public type DeleteTaskResult = { #ok : Bool; #err : Text };
};
