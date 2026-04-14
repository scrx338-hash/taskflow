import Time "mo:core/Time";
import Types "../types/tasks";
import TaskLib "../lib/tasks";

mixin (taskStore : TaskLib.TaskStore) {
  /// Create a new task for the caller
  public shared ({ caller }) func createTask(title : Text, description : Text) : async Types.CreateTaskResult {
    let now = Time.now();
    let id = TaskLib.generateId(caller, now);
    let task = TaskLib.newTask(id, caller, title, description, now);
    TaskLib.insertTask(taskStore, task);
    #ok(task);
  };

  /// Get all tasks belonging to the caller
  public query ({ caller }) func getTasks() : async [Types.Task] {
    TaskLib.getTasksByOwner(taskStore, caller);
  };

  /// Update a task's title and description (caller must own the task)
  public shared ({ caller }) func updateTask(id : Types.TaskId, title : Text, description : Text) : async Types.UpdateTaskResult {
    let now = Time.now();
    TaskLib.updateTask(taskStore, id, title, description, caller, now);
  };

  /// Toggle a task's completed status (caller must own the task)
  public shared ({ caller }) func toggleTask(id : Types.TaskId) : async Types.ToggleTaskResult {
    let now = Time.now();
    TaskLib.toggleTask(taskStore, id, caller, now);
  };

  /// Delete a task (caller must own the task)
  public shared ({ caller }) func deleteTask(id : Types.TaskId) : async Types.DeleteTaskResult {
    TaskLib.deleteTask(taskStore, id, caller);
  };
};
