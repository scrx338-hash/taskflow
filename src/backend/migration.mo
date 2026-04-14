import Map "mo:core/Map";
import Principal "mo:core/Principal";
import NewTypes "types/tasks";

module {
  // Old types defined inline (copied from .old/src/backend/types/tasks.mo)
  type OldTaskId = Text;
  type OldTask = {
    id : OldTaskId;
    owner : Principal;
    title : Text;
    description : Text;
    completed : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  type OldActor = {
    taskStore : Map.Map<OldTaskId, OldTask>;
  };

  type NewActor = {
    taskStore : Map.Map<NewTypes.TaskId, NewTypes.Task>;
  };

  public func run(old : OldActor) : NewActor {
    let taskStore = old.taskStore.map<OldTaskId, OldTask, NewTypes.Task>(
      func(_id, oldTask) {
        { oldTask with category = null; priority = null };
      }
    );
    { taskStore };
  };
};
