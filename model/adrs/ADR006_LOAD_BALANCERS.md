# ADR006

## Load Balancer

Putting lb in front of backend. Allows for better availability.
This ADR is about putting a lb in front of the backend.

## Options

- Leaving the frontend directly connected to the backend
- Connecting the frontend to backend LB which is then forwarding to the backend

Add a load balancer in front of backend vs not 
| Pros | Cons |
|----|----|
| Increase the avaliability as if the backend fails the frontend can still connect to it | Slightly simpler code in terraform |

## Outcome

By implementing this we have increased the availability of our system. Prior to this, if the backend went down we needed to run a full teardown of the entire system so that the frontend could be passed the link to the backend. By using a lb in between the frontend and backend, we do not need to do this. The frontend can be passed the link to the lb. This means that if the backend goes down, the autoscaling group can recover it and no other services will need to be restarted to reconnect them.
