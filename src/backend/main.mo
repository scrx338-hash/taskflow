import Map "mo:core/Map";
import TasksTypes "types/tasks";
import TaskLib "lib/tasks";
import TasksApi "mixins/tasks-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  let taskStore : TaskLib.TaskStore = Map.empty<TasksTypes.TaskId, TasksTypes.Task>();
  include TasksApi(taskStore);
};
