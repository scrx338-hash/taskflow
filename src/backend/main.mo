import Map "mo:core/Map";
import TasksTypes "types/tasks";
import TaskLib "lib/tasks";
import TasksApi "mixins/tasks-api";

actor {
  let taskStore : TaskLib.TaskStore = Map.empty<TasksTypes.TaskId, TasksTypes.Task>();
  include TasksApi(taskStore);
};
