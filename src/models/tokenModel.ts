import mongoose, { Schema, Document, model } from "mongoose";

export interface IToken extends Document {
  access_token: string;
  refresh_token: string;
  user_id: mongoose.Types.ObjectId;
  is_expired: boolean;
}

const tokenSchema: Schema<IToken> = new Schema(
  {
    access_token: {
      type: String,
    },
    refresh_token: {
      type: String,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_expired: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, 
    versionKey: false,
  }
);

export default model<IToken>("tokens", tokenSchema);
