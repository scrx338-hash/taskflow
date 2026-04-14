import Principal "mo:core/Principal";

module {
  public type TaskId = Text;

  public type Category = { #Work; #Personal; #Urgent };
  public type Priority = { #High; #Medium; #Low };

  public type Task = {
    id : TaskId;
    owner : Principal;
    title : Text;
    description : Text;
    completed : Bool;
    createdAt : Int;
    updatedAt : Int;
    category : ?Category;
    priority : ?Priority;
  };

  public type CreateTaskInput = {
    title : Text;
    description : Text;
    category : ?Category;
    priority : ?Priority;
  };

  public type UpdateTaskInput = {
    title : Text;
    description : Text;
    category : ?Category;
    priority : ?Priority;
  };

  public type CreateTaskResult = { #ok : Task; #err : Text };
  public type UpdateTaskResult = { #ok : Task; #err : Text };
  public type ToggleTaskResult = { #ok : Task; #err : Text };
  public type DeleteTaskResult = { #ok : Bool; #err : Text };
};
