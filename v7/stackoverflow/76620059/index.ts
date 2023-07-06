import * as m from 'mongoose';

interface MyDocument {
	deletedAt?: Date;
}

interface MyDocumentMethods {
	myDelete(): void;
	myUndelete(): void;
}

type ModelType = m.Model<MyDocument, {}, MyDocumentMethods>;

const MySchema = new m.Schema<MyDocument>({ deletedAt: Date });

MySchema.methods.myDelete = function () {
	this.deletedAt = new Date();
};
MySchema.method('myUndelete', function () {
	this.deletedAt = null;
});

const MyModel = m.model<MyDocument, ModelType>('MyCollection', MySchema);

let myInstance = new MyModel();
myInstance.myDelete();
myInstance.myUndelete();
myInstance.deletedAt; // ok
