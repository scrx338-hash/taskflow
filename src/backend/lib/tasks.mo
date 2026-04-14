import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Types "../types/tasks";

module {
  public type TaskStore = Map.Map<Types.TaskId, Types.Task>;

  /// Generate a new unique task ID
  public func generateId(caller : Principal, now : Int) : Types.TaskId {
    caller.toText() # "-" # now.toText();
  };

  /// Create a new Task record (does not persist)
  public func newTask(id : Types.TaskId, caller : Principal, input : Types.CreateTaskInput, now : Int) : Types.Task {
    {
      id;
      owner = caller;
      title = input.title;
      description = input.description;
      completed = false;
      createdAt = now;
      updatedAt = now;
      category = input.category;
      priority = input.priority;
    };
  };

  /// Insert a task into the store
  public func insertTask(store : TaskStore, task : Types.Task) : () {
    store.add(task.id, task);
  };

  /// Get all tasks belonging to a caller (ownership filter)
  public func getTasksByOwner(store : TaskStore, caller : Principal) : [Types.Task] {
    store.values()
      .filter(func(task : Types.Task) : Bool {
        Principal.equal(task.owner, caller)
      })
      .toArray();
  };

  /// Get a single task by id, returns null if not found or not owned by caller
  public func getTask(store : TaskStore, id : Types.TaskId, caller : Principal) : ?Types.Task {
    switch (store.get(id)) {
      case (?task) {
        if (Principal.equal(task.owner, caller)) { ?task } else { null };
      };
      case null { null };
    };
  };

  /// Update a task owned by caller using UpdateTaskInput
  public func updateTask(store : TaskStore, id : Types.TaskId, input : Types.UpdateTaskInput, caller : Principal, now : Int) : Types.UpdateTaskResult {
    switch (store.get(id)) {
      case null { #err("Task not found") };
      case (?task) {
        if (not Principal.equal(task.owner, caller)) {
          return #err("Not authorized");
        };
        let updated : Types.Task = {
          task with
          title = input.title;
          description = input.description;
          category = input.category;
          priority = input.priority;
          updatedAt = now;
        };
        store.add(id, updated);
        #ok(updated);
      };
    };
  };

  /// Toggle the completed field of a task owned by caller
  public func toggleTask(store : TaskStore, id : Types.TaskId, caller : Principal, now : Int) : Types.ToggleTaskResult {
    switch (store.get(id)) {
      case null { #err("Task not found") };
      case (?task) {
        if (not Principal.equal(task.owner, caller)) {
          return #err("Not authorized");
        };
        let updated : Types.Task = { task with completed = not task.completed; updatedAt = now };
        store.add(id, updated);
        #ok(updated);
      };
    };
  };

  /// Delete a task owned by caller, returns true if deleted
  public func deleteTask(store : TaskStore, id : Types.TaskId, caller : Principal) : Types.DeleteTaskResult {
    switch (store.get(id)) {
      case null { #err("Task not found") };
      case (?task) {
        if (not Principal.equal(task.owner, caller)) {
          return #err("Not authorized");
        };
        store.remove(id);
        #ok(true);
      };
    };
  };
};
