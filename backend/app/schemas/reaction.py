from pydantic import BaseModel, Field


class ReactionCountItem(BaseModel):
    target_id: str
    count: int


class ReactionsListResponse(BaseModel):
    target_type: str
    counts: list[ReactionCountItem]


class ReactionCreate(BaseModel):
    target_type: str = Field(min_length=1, max_length=32)
    target_id: str = Field(min_length=1, max_length=64)


class ReactionResponse(BaseModel):
    target_type: str
    target_id: str
    count: int
    already_reacted: bool
