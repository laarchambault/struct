class UserJobsController < ApplicationController
    belongs_to :user
    belongs_to :job
end
