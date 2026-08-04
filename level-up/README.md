<h1>
  <span class="headline">Student Success Hub</span>
  <span class="subhead">Level Up</span>
</h1>

## Level Up 1: Update and delete check-ins

Complete CRUD for the embedded resource.

### Back-end routes

```plaintext
PUT    /students/:studentId/check-ins/:checkInId
DELETE /students/:studentId/check-ins/:checkInId
```

Find the parent and then the subdocument:

```javascript
const student = await Student.findById(req.params.studentId)
const checkIn = student.checkIns.id(req.params.checkInId)
```

Allow the creator or an admin to make the change:

```javascript
const isCreator = checkIn.createdBy.toString() === req.user._id
const isAdminUser = req.user.role === 'admin'

if (!isCreator && !isAdminUser) {
  return res.status(403).json({ err: 'Not authorized.' })
}
```

For an update, assign each allowed field and save the parent:

```javascript
checkIn.confidence = req.body.confidence
checkIn.note = req.body.note
checkIn.needsSupport = req.body.needsSupport
await student.save()
```

For a delete:

```javascript
student.checkIns.pull({ _id: req.params.checkInId })
await student.save()
```

Build matching service functions and update the local `student.checkIns` array.

## Level Up 2: Add search and filters

Add controls to the student list for:

- Name search
- Status
- Assigned instructor
- Minimum attendance
- Skill

Start by filtering the fetched array in React. Later, move the filters to query parameters such as:

```plaintext
GET /students?status=active&instructor=66a123
```

## Level Up 3: Add a chart

Use a chart library to visualize one useful relationship:

- Students by status
- Confidence over time for one student
- Attendance ranges
- Check-ins that request support

Do not add a chart only for decoration. Choose a question that the chart answers more clearly than a number card.

## Level Up 4: Persist reward requests

Create a `RewardRequest` model with:

- `student` reference
- `requestedBy` reference
- Embedded reward snapshots
- `totalPoints`
- `status` enum: `pending`, `approved`, `declined`
- Timestamps

The embedded reward snapshot should preserve the reward name and points at the time of the request, even if the original reward changes later.

## Level Up 5: Add quantities

Change each cart item to this shape:

```javascript
{
  reward: reward,
  quantity: 1
}
```

When the same reward is added again, increase `quantity` instead of creating another cart row. Update the total to multiply `reward.points` by `quantity`.

## Level Up 6: Persist the cart locally

Store the cart in `localStorage` so it survives a refresh. Clear it when the user signs out.

This is still a front-end cart. A database-backed reward request is a separate feature.

## Level Up 7: Use MongoDB aggregation

Move one dashboard calculation to an API route, such as average attendance by status. Compare the aggregation pipeline with the original front-end `filter()` and `reduce()` solution.

## Level Up 8: Create an audit trail

Record which admin created, edited, assigned, or deleted a student. This is useful in real administrative tools because role-based access answers who *can* act, while an audit trail records who *did* act.
