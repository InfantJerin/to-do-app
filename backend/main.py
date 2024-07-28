# main.py
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

app = FastAPI()

# MongoDB connection
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.task_manager

# Pydantic models
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "To Do"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class TaskInDB(BaseModel):
    id: str = Field(alias="_id")
    title: str
    description: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        allow_population_by_field_name = True

# Helper function to convert MongoDB ObjectId to string
def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "description": task["description"],
        "status": task["status"],
        "created_at": task["created_at"],
    }

# Routes
@app.post("/tasks/", response_model=TaskInDB)
async def create_task(task: TaskCreate):
    new_task = await db.tasks.insert_one({
        **task.dict(),
        "created_at": datetime.utcnow()
    })
    created_task = await db.tasks.find_one({"_id": new_task.inserted_id})
    return task_helper(created_task)

@app.get("/tasks/", response_model=List[TaskInDB])
async def read_tasks(status: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status
    tasks = await db.tasks.find(query).to_list(1000)
    return [task_helper(task) for task in tasks]

@app.get("/tasks/{task_id}", response_model=TaskInDB)
async def read_task(task_id: str):
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if task:
        return task_helper(task)
    raise HTTPException(status_code=404, detail="Task not found")

@app.put("/tasks/{task_id}", response_model=TaskInDB)
async def update_task(task_id: str, task_update: TaskUpdate):
    update_data = {k: v for k, v in task_update.dict(exclude_unset=True).items() if v is not None}
    if len(update_data) < 1:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    updated_task = await db.tasks.find_one_and_update(
        {"_id": ObjectId(task_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if updated_task:
        return task_helper(updated_task)
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}", response_model=dict)
async def delete_task(task_id: str):
    delete_result = await db.tasks.delete_one({"_id": ObjectId(task_id)})
    if delete_result.deleted_count:
        return {"message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

